package com.tracker.tracker.controllers;

import com.tracker.tracker.models.entities.Schedule;
import com.tracker.tracker.models.request.CreateSchedule;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.request.FindTrainRequest;
import com.tracker.tracker.models.response.ScheduleResponse;
import com.tracker.tracker.services.IScheduleService;

import java.time.OffsetDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.security.Principal;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("/schedule")
public class ScheduleController {
    private final IScheduleService scheduleService;

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PostMapping("/create")
    public ResponseEntity<?> createSchedule(@Valid @RequestBody CreateSchedule createSchedule,
                                           Principal principal) {
        return ResponseEntity.ok(scheduleService.createSchedule(createSchedule, principal));
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateSchedule(@PathVariable UUID id,
                                           @Valid @RequestBody CreateSchedule createSchedule,
                                           Principal principal) {
        ScheduleResponse savedSchedule = scheduleService.updateSchedule(id, createSchedule, principal);
                return ResponseEntity.ok(savedSchedule);
    }

    @PreAuthorize("hasAnyAuthority('Super Admin', 'Passenger')")
    @GetMapping("/getschedule")
    public ResponseEntity<?> getAllSchedule(@RequestParam(value = "scheduleId", required = false)UUID scheduleId){
        if (scheduleId != null) {
            return ResponseEntity.ok(scheduleService.getSchedule(scheduleId));
        } else {
            return ResponseEntity.ok(scheduleService.getAllSchedule());
        }
    }

    @PreAuthorize("hasAnyAuthority('Super Admin', 'Passenger')")
    @GetMapping("/getschedule/{id}")
    public ResponseEntity<?> getAllScheduleByTrain(@PathVariable UUID id){
        return ResponseEntity.ok(scheduleService.getScheduleByTrain(id));
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PostMapping("/create/delay/{id}/{time}")
    public ResponseEntity<?> createDelaySchedule(@PathVariable UUID id,@PathVariable int time,
                                            Principal principal) {
        return ResponseEntity.ok(scheduleService.updateDelay(id,time, principal));
    }

    @PreAuthorize("hasAnyAuthority('Super Admin', 'Passenger')")
    @GetMapping("/getschstation/{id}")
    public ResponseEntity<?> getAllStationByTrain(@PathVariable UUID id){
        return ResponseEntity.ok(scheduleService.getStationByTrain(id));
    }

    @PreAuthorize("hasAnyAuthority('Super Admin', 'Passenger')")
    @GetMapping("/getschstation/all/trainloc/{from}/{to}")
    public ResponseEntity<?> getAllScheduleLocation(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime from, @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime to, Principal principal){
        return ResponseEntity.ok(scheduleService.getAllScheduleLiveLocations(from,to,principal));
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PostMapping("/create/locate/{id}/{loc}")
    public ResponseEntity<?> updateLocateSchedule(@PathVariable UUID id,@PathVariable UUID loc,
                                                 Principal principal) {
        return ResponseEntity.ok(scheduleService.updatelocations(id,loc, principal));
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PatchMapping("/delete")
    public ResponseEntity<?> deleteSchedule(@RequestBody DeleteRequest deleteRequest, Principal principal) {
        ScheduleResponse scheduleResponse = scheduleService.deleteSchedule(deleteRequest, principal);
        return ResponseEntity.ok(scheduleResponse);
    }

    @PreAuthorize("hasAnyAuthority('Passenger', 'Super Admin')")
    @PostMapping("/find/train")
    public ResponseEntity<?> findTrain(@RequestBody FindTrainRequest findTrainRequest,
        Principal principal) {
        List<Schedule> scheduleResponses = scheduleService.findTrain(findTrainRequest,
            principal);
        return ResponseEntity.ok(scheduleResponses);
    }

    @PreAuthorize("hasAnyAuthority('Passenger', 'Super Admin')")
    @PostMapping("/route/{id}")
    public ResponseEntity<?> getStations(@PathVariable UUID id,
        Principal principal) {
        List<String> scheduleStations = scheduleService.getScheduleStations(id,
            principal);
        return ResponseEntity.ok(scheduleStations);
    }
}
