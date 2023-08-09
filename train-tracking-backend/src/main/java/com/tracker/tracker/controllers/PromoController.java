package com.tracker.tracker.controllers;

import com.tracker.tracker.models.entities.Promotion;
import com.tracker.tracker.models.entities.Train;
import com.tracker.tracker.models.request.CreateTrain;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.response.PromoGetResponse;
import com.tracker.tracker.models.response.ScheduleResponse;
import com.tracker.tracker.models.response.TrainResponse;
import com.tracker.tracker.repositories.PromoRepository;
import com.tracker.tracker.services.IPromoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("/promo")
public class PromoController {
    private final IPromoService promoService;
    private final PromoRepository promoRepository;

    @PreAuthorize("hasAnyAuthority('Super Admin','Passenger')")
    @GetMapping("/findPromo")
    public ResponseEntity<?> getAllPromo(){
        return ResponseEntity.ok(promoService.getAllPrices());
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PatchMapping("/delete")
    public ResponseEntity<?> deleteSchedule(@RequestBody DeleteRequest deleteRequest, Principal principal) {
        PromoGetResponse scheduleResponse = promoService.deleteSchedule(deleteRequest, principal);
        return ResponseEntity.ok(scheduleResponse);
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PostMapping("/create")
    public ResponseEntity<?> createPromo(@Valid @RequestBody PromoGetResponse createPromo,
                                         Principal principal) {
        if (promoRepository.findByCode(createPromo.getCode())!=null) {
            return new ResponseEntity<>("Promo Code already exits.", HttpStatus.BAD_REQUEST);
        } else {
            return ResponseEntity.ok(promoService.createPromo(createPromo, principal));
        }
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePromo(@PathVariable UUID id,
                                         @Valid @RequestBody PromoGetResponse createPromo,
                                         Principal principal) {
        Promotion promotion = promoRepository.getById(id);
        if (promotion.getCode().equals(createPromo.getCode())){
            PromoGetResponse savedPromo = promoService.updatePromo(id,createPromo,
                    principal);
            return ResponseEntity.ok(savedPromo);
        }else {
            if (promoRepository.findByCode(createPromo.getCode())!=null) {
                return new ResponseEntity<>("Train name already exits.", HttpStatus.BAD_REQUEST);
            } else {
                PromoGetResponse savedPromo = promoService.updatePromo(id, createPromo,
                        principal);
                return ResponseEntity.ok(savedPromo);
            }
        }
    }

}
