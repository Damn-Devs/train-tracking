package com.tracker.tracker.repositories;

import com.tracker.tracker.models.entities.Promotion;
import com.tracker.tracker.models.response.PromoGetResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PromoRepository extends JpaRepository<Promotion, UUID> {
    List<Promotion> findByDeleted(Boolean deleted);

    Promotion findByCode(String code);
}
