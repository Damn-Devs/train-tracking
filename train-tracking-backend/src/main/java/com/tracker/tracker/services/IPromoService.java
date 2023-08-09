package com.tracker.tracker.services;

import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.response.PromoGetResponse;
import com.tracker.tracker.models.response.ScheduleResponse;
import com.tracker.tracker.models.response.TrainResponse;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

public interface IPromoService {

    List<PromoGetResponse> getAllPrices();

    PromoGetResponse deleteSchedule(DeleteRequest deleteRequest, Principal principal);

    PromoGetResponse createPromo(PromoGetResponse createPromo, Principal principal);

    PromoGetResponse updatePromo(UUID id, PromoGetResponse createPromo, Principal principal);
}
