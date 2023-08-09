package com.tracker.tracker.controllers;

import com.tracker.tracker.models.request.FindPriceRequest;
import com.tracker.tracker.models.request.UserCreateRequest;
import com.tracker.tracker.services.IPriceService;

import java.security.Principal;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("/price")
public class PriceController {
  private final IPriceService priceService;

  @PreAuthorize("hasAnyAuthority('Super Admin','Passenger')")
  @PostMapping("/findPrice")
  public ResponseEntity<?> findPrice(@RequestBody FindPriceRequest findPriceRequest){
    return ResponseEntity.ok(priceService.findPrice(findPriceRequest));
  }

  @PreAuthorize("hasAnyAuthority('Super Admin','Passenger')")
  @GetMapping("/findPrice")
  public ResponseEntity<?> getAllPrices(@RequestParam(value = "ticketTypeId", required = false)UUID ticketTypeId){
    if (ticketTypeId != null) {
      return ResponseEntity.ok(priceService.getPrice(ticketTypeId));
    } else {
      return ResponseEntity.ok(priceService.getAllPrices());
    }
  }

  @PreAuthorize("hasAnyAuthority('Super Admin')")
  @PutMapping("/update/{id}/{price}")
  public void updateUser(@PathVariable UUID id, @PathVariable String price, Principal principal) {
    priceService.updatePrice(price, id, principal);
  }

}
