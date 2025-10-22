package com.gymrat.controller;

import com.gymrat.dto.*;
import com.gymrat.model.*;
import com.gymrat.service.GymService;
import com.gymrat.util.MapperUtil;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class GymController {

    private static final Logger logger = LoggerFactory.getLogger(GymController.class);

    private final GymService gymService;

    public GymController(GymService gymService) {
        this.gymService = gymService;
    }

    @GetMapping("/users/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        logger.debug("Request received for user details with ID: {}", id);
        User user = gymService.getUser(id);
        logger.info("Successfully retrieved details for user ID: {}", id);
        return ResponseEntity.ok(MapperUtil.toDto(user));
    }

    @PostMapping("/users/{id}/train")
    public ResponseEntity<UserDto> train(@PathVariable Long id, @RequestBody @Valid TrainDto dto) {
        logger.info("User {} initiated training: stat={}, amount={}", id, dto.getStat(), dto.getAmount());
        User user = gymService.train(id, dto.getStat(), dto.getAmount());
        logger.info("User {} successfully trained.", id);
        return ResponseEntity.ok(MapperUtil.toDto(user));
    }

    @PostMapping("/users/{id}/rest")
    public ResponseEntity<UserDto> rest(@PathVariable Long id, @RequestBody @Valid RestDto dto) {
        logger.info("User {} initiated rest for amount={}", id, dto.getAmount());
        User user = gymService.rest(id, dto.getAmount());
        logger.info("User {} successfully rested.", id);
        return ResponseEntity.ok(MapperUtil.toDto(user));
    }

    @PostMapping("/users/{id}/purchase")
    public ResponseEntity<AccessoryDto> purchase(@PathVariable Long id, @RequestBody @Valid PurchaseDto dto) {
        logger.info("User {} attempting to purchase accessory: {}", id, dto.getAccessoryName());
        Accessory accessory = gymService.purchaseAccessory(id, dto.getAccessoryName());
        logger.info("User {} successfully purchased accessory: {}", id, dto.getAccessoryName());
        return ResponseEntity.ok(MapperUtil.toDto(accessory));
    }
}
