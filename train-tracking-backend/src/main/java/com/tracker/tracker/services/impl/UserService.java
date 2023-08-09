package com.tracker.tracker.services.impl;

import com.tracker.tracker.auth.UserDetailServiceImpl;
import com.tracker.tracker.auth.UserDetailsImpl;
import com.tracker.tracker.models.json.IdWithName;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.response.UserGetResponse;
import com.tracker.tracker.models.response.UserResponse;
import com.tracker.tracker.models.entities.Role;
import com.tracker.tracker.models.entities.Users;
import com.tracker.tracker.models.request.UserCreateRequest;
import com.tracker.tracker.repositories.RoleRepository;
import com.tracker.tracker.repositories.UserRepository;
import com.tracker.tracker.services.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserService implements IUserService {
    private final UserRepository usersRepository;
    private final UserDetailServiceImpl userDetailsService;
    private final RoleRepository roleRepository;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUsers(UserCreateRequest userCreateRequest, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();
        List<String> roleList = user.getRoles().stream().map(Role::getName).collect(Collectors.toList());

        Users newUser =new Users();
        newUser.setName(userCreateRequest.getName());
        newUser.setEmail(userCreateRequest.getEmail());
        newUser.setUsername(userCreateRequest.getUsername());
        newUser.setPassword(passwordEncoder.encode(userCreateRequest.getPassword()));


        Set<Role> roles = new HashSet<>();
        if (userCreateRequest.getRoleIds().size() > 0) {
            for (UUID uuid: userCreateRequest.getRoleIds()) {
                roles.add(roleRepository.findById(uuid).get());
            }
        }
        newUser.setRoles(roles);
        newUser.setCreatedBy(user);
        newUser.setCreatedTime(OffsetDateTime.now());
        newUser.setModifiedTime(OffsetDateTime.now());
        return userResponseConvertor(usersRepository.save(newUser));
    }

    @Override
    public UserResponse updateUserPersonalData( UUID id,UserCreateRequest userUpdateRequest,
                                                Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();
        Set<Role> roles = new HashSet<>();
        String roleHave= String.valueOf('0');
        String s=null;
        for (UUID uuid: userUpdateRequest.getRoleIds()) {
            if (uuid==null){
                roles.add(null);
            }else{
                roles.add(roleRepository.findById(uuid).get());
                s = roleHave + '1';
            }
        }
        Users updateUser = usersRepository.findById(id).get();
        updateUser.setName(userUpdateRequest.getName());
        updateUser.setEmail(userUpdateRequest.getEmail());
        updateUser.setUsername(userUpdateRequest.getUsername());
        if (s!=null){
            updateUser.setRoles(roles);
        }
        if (userUpdateRequest.getPassword()!=null && (!userUpdateRequest.getPassword().equals(""))){
            updateUser.setPassword(passwordEncoder.encode(userUpdateRequest.getPassword()));
        }
        updateUser.setModifiedBy(user);
        updateUser.setModifiedTime(OffsetDateTime.now());
        return userResponseConvertor(usersRepository.save(updateUser));
    }

    @Override
    public List<UserGetResponse> getUser(UUID userId) {
        List<UserGetResponse> userGetResponses = new ArrayList<>();
        {
            if (usersRepository.findAll().size()>0) {
                userGetResponses.add(userGetResponses(usersRepository.findById(userId).get()));
            }
        }
        return userGetResponses;
    }

    @Override
    public List<UserGetResponse> getAllUsers() {
        List<UserGetResponse> userGetResponses = new ArrayList<>();

            for (Users users :
                    usersRepository.findByDeletedOrderByCreatedTimeDesc(false)) {
                userGetResponses.add(userGetResponses(users));
            }


        return userGetResponses;
    }

    @Override
    public UserResponse deleteUsers(DeleteRequest deleteRequest, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();
        Users DeleteUser =
                usersRepository.findById(UUID.fromString(deleteRequest.getId())).get();
        DeleteUser.setDeleted(deleteRequest.getDelete());
        DeleteUser.setUsername("");
        DeleteUser.setModifiedBy(user);
        DeleteUser.setModifiedTime(OffsetDateTime.now());

        return userResponseConvertor(usersRepository.save(DeleteUser));
    }

    private UserGetResponse userGetResponses(Users users) {
        Set<IdWithName> roles = new HashSet<>();
        UserGetResponse userGetResponse = new UserGetResponse();
        userGetResponse.setId(users.getId());
        userGetResponse.setName(users.getName());
        userGetResponse.setEmail(users.getEmail());
        userGetResponse.setUsername(users.getUsername());
        userGetResponse.setDelete(users.getDeleted());
        for (Role role: users.getRoles()) {
            IdWithName idWithName =new IdWithName();
            idWithName.setId(String.valueOf(role.getId()));
            idWithName.setName(role.getName());
            roles.add(idWithName);
        }
        userGetResponse.setRoleIds(roles);
        if (users.getCreatedBy()==null){
            userGetResponse.setCreatedBy("N/A");
        }else {
            userGetResponse.setCreatedBy(users.getCreatedBy().getName());
        }
        if (users.getModifiedBy()==null){
            userGetResponse.setModifiedBy("N/A");
        }else {
            userGetResponse.setModifiedBy(users.getModifiedBy().getName());
        }
        userGetResponse.setLastModified(users.getModifiedTime());
        return userGetResponse;
    }

    private UserResponse userResponseConvertor(Users users) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(users.getId());
        userResponse.setName(users.getName());
        return userResponse;
    }
}
