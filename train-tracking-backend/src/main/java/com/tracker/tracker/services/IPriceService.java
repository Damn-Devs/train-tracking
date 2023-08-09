package com.tracker.tracker.services;

import com.tracker.tracker.models.entities.Price;
import com.tracker.tracker.models.request.FindPriceRequest;
import com.tracker.tracker.models.response.PriceResponse;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

public interface IPriceService {

  double  findPrice(FindPriceRequest findPriceRequest);

  List<PriceResponse> getPrice(UUID ticketTypeId);

  List<PriceResponse> getAllPrices();

  void updatePrice(String price, UUID id, Principal principal);
}
