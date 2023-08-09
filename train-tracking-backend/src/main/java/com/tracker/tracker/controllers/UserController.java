package com.tracker.tracker.controllers;

import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.response.UserResponse;
import com.tracker.tracker.models.entities.Users;
import com.tracker.tracker.models.request.UserCreateRequest;
import com.tracker.tracker.repositories.UserRepository;
import com.tracker.tracker.services.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.time.OffsetDateTime;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserRepository usersRepository;
    private final IUserService usersService;

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PostMapping("/create")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserCreateRequest userCreateRequest,
                                        Principal principal) {
        if (usersRepository.findByUsername(userCreateRequest.getUsername()).isPresent()) {
            return new ResponseEntity<>("Username already exits.", HttpStatus.BAD_REQUEST);
        } else {
            return ResponseEntity.ok(usersService.createUsers(userCreateRequest, principal));
        }
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable UUID id,
                                        @Valid @RequestBody UserCreateRequest userUpdateRequest,
                                        Principal principal) {
        Users users =usersRepository.findById(id).get();
        if (users.getUsername().equals(userUpdateRequest.getUsername())){
            UserResponse savedUser = usersService.updateUserPersonalData(id,userUpdateRequest,
                    principal);
            return ResponseEntity.ok(savedUser);
        }else {
            if (usersRepository.findByUsername(userUpdateRequest.getUsername()).isPresent()) {
                return new ResponseEntity<>("Username already exits.", HttpStatus.BAD_REQUEST);
            } else {
                UserResponse savedUser = usersService.updateUserPersonalData(id, userUpdateRequest,
                        principal);
                return ResponseEntity.ok(savedUser);
            }
        }
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @GetMapping("/getuser")
    public ResponseEntity<?> getAllUsers(@RequestParam(value = "userId", required = false)UUID userId){
        if (userId != null) {
            return ResponseEntity.ok(usersService.getUser(userId));
        } else {
            return ResponseEntity.ok(usersService.getAllUsers());
        }
    }

    @PreAuthorize("hasAnyAuthority('Super Admin')")
    @PatchMapping("/delete")
    public ResponseEntity<?> deleteUsers(@RequestBody DeleteRequest deleteRequest, Principal principal) {
        UserResponse deleteUsers = usersService.deleteUsers(deleteRequest, principal);
        return ResponseEntity.ok(deleteUsers);
    }
}
