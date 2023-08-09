package com.tracker.tracker.controllers;

import com.tracker.tracker.auth.UserDetailsImpl;
import com.tracker.tracker.models.entities.Users;
import com.tracker.tracker.models.json.JwtResponse;
import com.tracker.tracker.models.json.LoginUser;
import com.tracker.tracker.repositories.UserRepository;
import com.tracker.tracker.security.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository usersRepository;
    /*Auth controller*/
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginUser loginUser) {
        if (usersRepository.findByUsername(loginUser.getUsername()).isEmpty()){
  //          Users user = usersRepository.findByUsername(loginUser.getUsername()).get();
            return ResponseEntity.badRequest().body("Please enter valid user credentials");
        }

//        if (loginUser.getUsername()!= null){
//            Users users = usersRepository.findByUsername(loginUser.getUsername()).get();
//            users = usersRepository.save(users);
//        }
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginUser.getUsername(), loginUser.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());



        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

}

