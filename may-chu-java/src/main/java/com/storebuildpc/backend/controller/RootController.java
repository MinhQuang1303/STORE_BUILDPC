package com.storebuildpc.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {
    @GetMapping("/")
    public String root() {
        return "🚀 Máy chủ STORE_BUILDPC đang hoạt động!";
    }
}
