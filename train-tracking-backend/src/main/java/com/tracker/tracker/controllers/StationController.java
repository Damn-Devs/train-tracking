package com.tracker.tracker.controllers;

import com.tracker.tracker.models.entities.Station;
import com.tracker.tracker.models.entities.Train;
import com.tracker.tracker.models.request.CreateStation;
import com.tracker.tracker.models.request.CreateStation;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.response.StationResponse;
import com.tracker.tracker.models.response.StationResponse;
import com.tracker.tracker.repositories.StationRepository;
import com.tracker.tracker.services.IStationService;
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
@RequestMapping("/station")
public class StationController {
    private final StationRepository stationRepository;
    private final IStationService stationService;

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PostMapping("/create")
    public ResponseEntity<?> createStation(@Valid @RequestBody CreateStation createStation,
                                         Principal principal) {
        if (stationRepository.findByName(createStation.getName()).isPresent()) {
            return new ResponseEntity<>("Station name already exits.", HttpStatus.BAD_REQUEST);
        } else {
            return ResponseEntity.ok(stationService.createStation(createStation, principal));
        }
    }
    //
    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateStation(@PathVariable UUID id,
                                         @Valid @RequestBody CreateStation createStation,
                                         Principal principal) {
        Station station =stationRepository.findById(id).get();
        if (station.getName().equals(createStation.getName())){
            StationResponse savedStation = stationService.updateStation(id,createStation,
                    principal);
            return ResponseEntity.ok(savedStation);
        }else {
            if (stationRepository.findByName(createStation.getName()).isPresent()) {
                return new ResponseEntity<>("Station name already exits.", HttpStatus.BAD_REQUEST);
            } else {
                StationResponse savedStation = stationService.updateStation(id, createStation,
                        principal);
                return ResponseEntity.ok(savedStation);
            }
        }
    }

    @PreAuthorize("hasAnyAuthority('Super Admin','Passenger')")
    @GetMapping("/getustation")
    public ResponseEntity<?> getAllStation(@RequestParam(value = "stationId", required = false)UUID stationId){
        if (stationId != null) {
            return ResponseEntity.ok(stationService.getStation(stationId));
        } else {
            return ResponseEntity.ok(stationService.getAllStation());
        }
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PatchMapping("/delete")
    public ResponseEntity<?> deleteStation(@RequestBody DeleteRequest deleteRequest, Principal principal) {
        StationResponse stationResponse = stationService.deleteStation(deleteRequest, principal);
        return ResponseEntity.ok(stationResponse);
    }
}
