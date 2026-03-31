package com.storebuildpc.backend.contract;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DynamicTest;
import org.junit.jupiter.api.TestFactory;

class ContractShapeTest {
    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    // Override with env vars when needed:
    // CONTRACT_NODE_BASE_URL=http://localhost:5001
    // CONTRACT_JAVA_BASE_URL=http://localhost:5000
    private static final String NODE_BASE_URL = System.getenv().getOrDefault("CONTRACT_NODE_BASE_URL", "http://localhost:5001");
    private static final String JAVA_BASE_URL = System.getenv().getOrDefault("CONTRACT_JAVA_BASE_URL", "http://localhost:5000");

    @TestFactory
    List<DynamicTest> compareContractShapes() throws Exception {
        List<RouteCase> routes = loadRoutes();
        List<DynamicTest> tests = new ArrayList<>();

        for (RouteCase route : routes) {
            tests.add(DynamicTest.dynamicTest(route.method + " " + route.path, () -> {
                HttpResult node = call(NODE_BASE_URL, route.path, route.method);
                HttpResult spring = call(JAVA_BASE_URL, route.path, route.method);

                Assertions.assertEquals(
                        node.statusCode,
                        spring.statusCode,
                        "Status code mismatch for " + route.path + "\nNode body: " + node.body + "\nSpring body: " + spring.body
                );

                JsonNode nodeJson = parse(node.body);
                JsonNode springJson = parse(spring.body);
                assertJsonShapeEquals(nodeJson, springJson, route.path);
            }));
        }
        return tests;
    }

    private static List<RouteCase> loadRoutes() throws Exception {
        List<RouteCase> routes = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                Objects.requireNonNull(ContractShapeTest.class.getResourceAsStream("/contract-routes.txt")),
                StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String trimmed = line.trim();
                if (trimmed.isEmpty() || trimmed.startsWith("#")) {
                    continue;
                }
                String[] parts = trimmed.split("\\|");
                routes.add(new RouteCase(parts[0], parts[1]));
            }
        }
        return routes;
    }

    private static HttpResult call(String baseUrl, String path, String method) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + path))
                .timeout(Duration.ofSeconds(10))
                .method(method, HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
        return new HttpResult(response.statusCode(), response.body());
    }

    private static JsonNode parse(String body) throws Exception {
        if (body == null || body.isBlank()) {
            return MAPPER.nullNode();
        }
        String trimmed = body.trim();
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
            return MAPPER.readTree(trimmed);
        }
        return MAPPER.valueToTree(trimmed);
    }

    private static void assertJsonShapeEquals(JsonNode expected, JsonNode actual, String context) {
        if (expected.isObject() && actual.isObject()) {
            Set<String> expectedKeys = new LinkedHashSet<>();
            expected.fieldNames().forEachRemaining(expectedKeys::add);
            Set<String> actualKeys = new LinkedHashSet<>();
            actual.fieldNames().forEachRemaining(actualKeys::add);
            Assertions.assertEquals(expectedKeys, actualKeys, "Object keys mismatch at " + context);
            for (String key : expectedKeys) {
                assertJsonShapeEquals(expected.get(key), actual.get(key), context + "." + key);
            }
            return;
        }

        if (expected.isArray() && actual.isArray()) {
            // Compare by first element's shape when both arrays are non-empty.
            if (!expected.isEmpty() && !actual.isEmpty()) {
                assertJsonShapeEquals(expected.get(0), actual.get(0), context + "[0]");
            }
            return;
        }

        Assertions.assertEquals(
                expected.getNodeType(),
                actual.getNodeType(),
                "Node type mismatch at " + context + " (expected " + expected.getNodeType() + ", actual " + actual.getNodeType() + ")"
        );
    }

    private record RouteCase(String path, String method) {
    }

    private record HttpResult(int statusCode, String body) {
    }
}
