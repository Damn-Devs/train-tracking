package com.tracker.tracker.controllers;


import com.tracker.tracker.services.impl.RevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge=3600)
@RestController
@RequestMapping("/revenue")
public class RevenueController {
    private final RevenueService revenueService;

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @GetMapping("/get/name/{trainName}")
    public ResponseEntity<?> getByName(@PathVariable("trainName") String trainName) {
        if(trainName != null && !trainName.isEmpty()) {
            return ResponseEntity.ok(revenueService.getRevenueOverview(trainName));
        }
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }
}

