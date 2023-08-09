package com.tracker.tracker.repositories;

import com.tracker.tracker.models.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<Users, UUID> {
    Optional<Users> findByUsername(String username);

    Users findByUsernameAndDeleted(String username, Boolean deleted);


    List<Users> findByDeletedOrderByCreatedTimeDesc(Boolean deleted);

}
