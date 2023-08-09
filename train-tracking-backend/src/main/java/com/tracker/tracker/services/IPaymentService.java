package com.tracker.tracker.services;

import com.tracker.tracker.models.json.RevenueStatic;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.request.PaymentCreate;
import com.tracker.tracker.models.response.PaymentGetResponse;
import com.tracker.tracker.models.response.PaymentResponse;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

public interface IPaymentService {
    PaymentResponse paymentCreate(PaymentCreate paymentRequest, Principal principal);

    PaymentResponse updatePayment(UUID id, PaymentCreate paymentRequest, Principal principal);

    List<PaymentGetResponse> getPayment(UUID paymentId);

    List<PaymentGetResponse> getAllPayment();

    PaymentResponse deletePayment(DeleteRequest deleteRequest, Principal principal);

    Double getTotalRevenue();

    List<RevenueStatic> getRevenueChart();
}
