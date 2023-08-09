package com.tracker.tracker.services;

import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.response.UserGetResponse;
import com.tracker.tracker.models.response.UserResponse;
import com.tracker.tracker.models.request.UserCreateRequest;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

public interface IUserService {
    UserResponse createUsers(UserCreateRequest userCreateRequest, Principal principal);

    UserResponse updateUserPersonalData(UUID id, UserCreateRequest userUpdateRequest, Principal principal);

    List<UserGetResponse> getUser(UUID userId);

    List<UserGetResponse> getAllUsers();

    UserResponse deleteUsers(DeleteRequest deleteRequest, Principal principal);
}
