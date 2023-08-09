package com.tracker.tracker.controllers;

import com.tracker.tracker.models.entities.Train;
import com.tracker.tracker.models.entities.Users;
import com.tracker.tracker.models.request.CreateTrain;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.request.UserCreateRequest;
import com.tracker.tracker.models.response.TrainResponse;
import com.tracker.tracker.models.response.UserResponse;
import com.tracker.tracker.repositories.TrainRepository;
import com.tracker.tracker.services.ITrainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.UUID;

@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge=3600)
@RestController
@RequestMapping("/train")
public class TrainController {
    private final TrainRepository trainRepository;
    private final ITrainService trainService;

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PostMapping("/create")
    public ResponseEntity<?> createTrain(@Valid @RequestBody CreateTrain createTrain,
                                        Principal principal) {
        if (trainRepository.findByName(createTrain.getName()).isPresent()) {
            return new ResponseEntity<>("Train name already exits.", HttpStatus.BAD_REQUEST);
        } else {
            return ResponseEntity.ok(trainService.createTrain(createTrain, principal));
        }
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTrain(@PathVariable UUID id,
                                        @Valid @RequestBody CreateTrain createTrain,
                                        Principal principal) {
        Train train =trainRepository.findById(id).get();
        if (train.getName().equals(createTrain.getName())){
            TrainResponse savedTrain = trainService.updateTrain(id,createTrain,
                    principal);
            return ResponseEntity.ok(savedTrain);
        }else {
            if (trainRepository.findByName(createTrain.getName()).isPresent()) {
                return new ResponseEntity<>("Train name already exits.", HttpStatus.BAD_REQUEST);
            } else {
                TrainResponse savedTrain = trainService.updateTrain(id, createTrain,
                        principal);
                return ResponseEntity.ok(savedTrain);
            }
        }
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @GetMapping("/getutrain")
    public ResponseEntity<?> getAllTrains(@RequestParam(value = "trainId", required = false)UUID trainId){
        if (trainId != null) {
            return ResponseEntity.ok(trainService.getTrain(trainId));
        } else {
            return ResponseEntity.ok(trainService.getAllTrain());
        }
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PatchMapping("/delete")
    public ResponseEntity<?> deleteTrain(@RequestBody DeleteRequest deleteRequest, Principal principal) {
        TrainResponse trainResponse = trainService.deleteTrain(deleteRequest, principal);
        return ResponseEntity.ok(trainResponse);
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @GetMapping("/count")
    public ResponseEntity<?> trainCount() {
        long trainCount = trainService.getCount();
        return ResponseEntity.ok(trainCount);
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @GetMapping("/get/chart/name/{trainName}")
    public ResponseEntity<?> getTrainChartByName(@PathVariable String trainName) {
        return ResponseEntity.ok(trainService.getTrainStatisticsChart(trainName));
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @GetMapping("/revenue/all")
    public ResponseEntity<?> getTrainAndRevenue() {
        return ResponseEntity.ok(trainService.getTrainAndRevenue());
    }
}
