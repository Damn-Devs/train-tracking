package com.tracker.tracker.repositories;

import com.tracker.tracker.models.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    Role findByName(String name);
    List<Role> findByNameNotContains(String name);
}
