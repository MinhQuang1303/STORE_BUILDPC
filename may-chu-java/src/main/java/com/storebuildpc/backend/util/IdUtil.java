package com.storebuildpc.backend.util;

public final class IdUtil {
    private IdUtil() {
    }

    public static Long toLong(String value) {
        return Long.parseLong(value);
    }
}
