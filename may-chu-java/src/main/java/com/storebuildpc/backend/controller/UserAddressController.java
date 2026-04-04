package com.storebuildpc.backend.controller;

import com.storebuildpc.backend.model.User;
import com.storebuildpc.backend.model.UserAddress;
import com.storebuildpc.backend.repository.UserRepository;
import com.storebuildpc.backend.repository.UserAddressRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user-addresses")
public class UserAddressController {

    private final UserAddressRepository addressRepository;
    private final UserRepository userRepository;

    public UserAddressController(UserAddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    private Map<String, Object> mapToResponse(UserAddress addr) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("_id", addr.getMongoId());
        map.put("fullName", addr.getFullName());
        map.put("phone", addr.getPhone());
        map.put("address", addr.getAddress());
        map.put("isDefault", addr.getIsDefault());
        map.put("createdAt", addr.getCreatedAt());
        return map;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserAddresses(@PathVariable String userId) {
        try {
            Long id = Long.parseLong(userId);
            List<UserAddress> addresses = addressRepository.findByIdUser_IdOrderByIsDefaultDesc(id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", addresses.stream().map(this::mapToResponse).toList()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "ID sai định dạng"));
        }
    }

    @PostMapping
    public ResponseEntity<?> addAddress(@RequestBody Map<String, Object> body) {
        try {
            Long userId = Long.parseLong(String.valueOf(body.get("userId")));
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Không tìm thấy User"));
            }

            UserAddress newAddr = new UserAddress();
            newAddr.setIdUser(userOpt.get());
            newAddr.setFullName(String.valueOf(body.getOrDefault("fullName", "")));
            newAddr.setPhone(String.valueOf(body.getOrDefault("phone", "")));
            newAddr.setAddress(String.valueOf(body.getOrDefault("address", "")));
            
            boolean isDefault = Boolean.parseBoolean(String.valueOf(body.getOrDefault("isDefault", "false")));
            List<UserAddress> existings = addressRepository.findByIdUser_IdOrderByIsDefaultDesc(userId);
            if (existings.isEmpty()) {
                isDefault = true; // First address
            }
            
            if (isDefault) {
                for (UserAddress a : existings) {
                    a.setIsDefault(false);
                    addressRepository.save(a);
                }
            }
            newAddr.setIsDefault(isDefault);

            UserAddress saved = addressRepository.save(newAddr);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "success", true,
                    "message", "Thêm địa chỉ thành công",
                    "data", mapToResponse(saved)
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Lỗi dữ liệu"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(@PathVariable String id, @RequestBody Map<String, Object> body) {
        try {
            return addressRepository.findById(Long.parseLong(id)).map(addr -> {
                if (body.containsKey("fullName")) addr.setFullName(String.valueOf(body.get("fullName")));
                if (body.containsKey("phone")) addr.setPhone(String.valueOf(body.get("phone")));
                if (body.containsKey("address")) addr.setAddress(String.valueOf(body.get("address")));

                // Update default status if requested
                if (body.containsKey("isDefault")) {
                    boolean makeDefault = Boolean.parseBoolean(String.valueOf(body.get("isDefault")));
                    if (makeDefault && !addr.getIsDefault()) {
                        Long userId = addr.getIdUser().getId();
                        List<UserAddress> existings = addressRepository.findByIdUser_IdOrderByIsDefaultDesc(userId);
                        for (UserAddress a : existings) {
                            a.setIsDefault(false);
                            addressRepository.save(a);
                        }
                        addr.setIsDefault(true);
                    }
                }

                UserAddress saved = addressRepository.save(addr);
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Cập nhật địa chỉ thành công",
                        "data", mapToResponse(saved)
                ));
            }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Không tìm thấy địa chỉ")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "ID sai định dạng"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable String id) {
        try {
            return addressRepository.findById(Long.parseLong(id)).map(addr -> {
                Long userId = addr.getIdUser().getId();
                boolean wasDefault = addr.getIsDefault();
                
                addressRepository.delete(addr);
                
                if (wasDefault) {
                    List<UserAddress> remains = addressRepository.findByIdUser_IdOrderByIsDefaultDesc(userId);
                    if (!remains.isEmpty()) {
                        UserAddress first = remains.get(0);
                        first.setIsDefault(true);
                        addressRepository.save(first);
                    }
                }
                
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Xóa địa chỉ thành công"
                ));
            }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Không tìm thấy địa chỉ")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "ID sai định dạng"));
        }
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<?> setDefaultAddress(@PathVariable String id) {
        try {
            return addressRepository.findById(Long.parseLong(id)).map(addr -> {
                Long userId = addr.getIdUser().getId();
                List<UserAddress> all = addressRepository.findByIdUser_IdOrderByIsDefaultDesc(userId);
                for (UserAddress a : all) {
                    a.setIsDefault(a.getId().equals(addr.getId()));
                    addressRepository.save(a);
                }
                
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Đã đặt làm mặc định"
                ));
            }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Không tìm thấy địa chỉ")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "ID sai định dạng"));
        }
    }
}
