package com.tracker.tracker.services.impl;

import com.tracker.tracker.auth.UserDetailServiceImpl;
import com.tracker.tracker.auth.UserDetailsImpl;
import com.tracker.tracker.models.entities.Payment;
import com.tracker.tracker.models.entities.Users;
import com.tracker.tracker.models.json.RevenueStatic;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.request.PaymentCreate;
import com.tracker.tracker.models.response.PaymentGetResponse;
import com.tracker.tracker.models.response.PaymentResponse;
import com.tracker.tracker.repositories.PaymentRepository;
import com.tracker.tracker.repositories.UserRepository;
import com.tracker.tracker.services.IPaymentService;
import java.time.Month;
import java.time.ZoneOffset;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class PaymentService implements IPaymentService {
    private final UserRepository usersRepository;
    private final PaymentRepository paymentRepository;
    private final UserDetailServiceImpl userDetailsService;

    @Override
    public PaymentResponse paymentCreate(PaymentCreate paymentRequest, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();

        Payment newPayment =new Payment();
        newPayment.setMethod(paymentRequest.getMethod());
        newPayment.setTotal(paymentRequest.getTotal());
        newPayment.setCreatedBy(user);
        newPayment.setCreatedTime(OffsetDateTime.now());
        newPayment.setModifiedTime(OffsetDateTime.now());
        return PaymentResponseConvertor(paymentRepository.save(newPayment));
    }


    @Override
    public PaymentResponse updatePayment(UUID id, PaymentCreate createPayment, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();
        Payment updatePayment = paymentRepository.findById(id).get();
        updatePayment.setMethod(createPayment.getMethod());
        updatePayment.setTotal(createPayment.getTotal());
        updatePayment.setModifiedBy(user);
        updatePayment.setModifiedTime(OffsetDateTime.now());
        return PaymentResponseConvertor(paymentRepository.save(updatePayment));
    }

    @Override
    public List<PaymentGetResponse> getPayment(UUID paymentId) {
        List<PaymentGetResponse> paymentGetResponses = new ArrayList<>();
        {
            if (paymentRepository.findAll().size()>0) {
                paymentGetResponses.add(paymentGetResponsesConverter(paymentRepository.findById(paymentId).get()));
            }
        }
        return paymentGetResponses;
    }

    @Override
    public List<PaymentGetResponse> getAllPayment() {
        List<PaymentGetResponse> paymentGetResponses = new ArrayList<>();

        for (Payment payment :
                paymentRepository.findByDeletedOrderByCreatedTimeDesc(false)) {
            paymentGetResponses.add(paymentGetResponsesConverter(payment));
        }
        return paymentGetResponses;
    }

    @Override
    public PaymentResponse deletePayment(DeleteRequest deleteRequest, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();
        Payment DelePayment =
                paymentRepository.findById(UUID.fromString(deleteRequest.getId())).get();
        DelePayment .setDeleted(deleteRequest.getDelete());
        DelePayment .setModifiedBy(user);
        DelePayment .setModifiedTime(OffsetDateTime.now());

        return PaymentResponseConvertor(paymentRepository.save(DelePayment));
    }

    @Override
    public Double getTotalRevenue() {
        return paymentRepository.getAllRevenue();
    }

    @Override
    public List<RevenueStatic> getRevenueChart() {
        int year = OffsetDateTime.now().getYear();
        OffsetDateTime firstDate = OffsetDateTime.of(year, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime lastDate = OffsetDateTime.of(year, 12, 31, 23, 59, 59, 999_999_999, ZoneOffset.UTC);

        List<Payment> payments = paymentRepository.findByCreatedTimeBetween(firstDate, lastDate);

        List<RevenueStatic> revenueStatics = new ArrayList<>();
        revenueStatics.add(new RevenueStatic("January", 0));
        revenueStatics.add(new RevenueStatic("Feb", 0));
        revenueStatics.add(new RevenueStatic("March", 0));
        revenueStatics.add(new RevenueStatic("April", 0));
        revenueStatics.add(new RevenueStatic("May", 0));
        revenueStatics.add(new RevenueStatic("June", 0));
        revenueStatics.add(new RevenueStatic("July", 0));
        revenueStatics.add(new RevenueStatic("Aug", 0));
        revenueStatics.add(new RevenueStatic("Sep", 0));
        revenueStatics.add(new RevenueStatic("Oct", 0));
        revenueStatics.add(new RevenueStatic("Nov", 0));
        revenueStatics.add(new RevenueStatic("Dec", 0));

        for (Payment payment:payments) {
            switch (payment.getCreatedTime().getMonth()){
                case JANUARY:
                    revenueStatics.get(0).setRevenueStats(revenueStatics.get(0).getRevenueStats() + payment.getTotal());
                    break;
                case FEBRUARY:
                    revenueStatics.get(1).setRevenueStats(revenueStatics.get(1).getRevenueStats() + payment.getTotal());
                    break;
                case MARCH:
                    revenueStatics.get(2).setRevenueStats(revenueStatics.get(2).getRevenueStats() + payment.getTotal());
                    break;
                case APRIL:
                    revenueStatics.get(3).setRevenueStats(revenueStatics.get(3).getRevenueStats() + payment.getTotal());
                    break;
                case MAY:
                    revenueStatics.get(4).setRevenueStats(revenueStatics.get(4).getRevenueStats() + payment.getTotal());
                    break;
                case JUNE:
                    revenueStatics.get(5).setRevenueStats(revenueStatics.get(5).getRevenueStats() + payment.getTotal());
                    break;
                case JULY:
                    revenueStatics.get(6).setRevenueStats(revenueStatics.get(6).getRevenueStats() + payment.getTotal());
                    break;
                case AUGUST:
                    revenueStatics.get(7).setRevenueStats(revenueStatics.get(7).getRevenueStats() + payment.getTotal());
                    break;
                case SEPTEMBER:
                    revenueStatics.get(8).setRevenueStats(revenueStatics.get(8).getRevenueStats() + payment.getTotal());
                    break;
                case OCTOBER:
                    revenueStatics.get(9).setRevenueStats(revenueStatics.get(9).getRevenueStats() + payment.getTotal());
                    break;
                case NOVEMBER:
                    revenueStatics.get(10).setRevenueStats(revenueStatics.get(10).getRevenueStats() + payment.getTotal());
                    break;
                case DECEMBER:
                    revenueStatics.get(11).setRevenueStats(revenueStatics.get(11).getRevenueStats() + payment.getTotal());
                    break;
            }
        }


        return revenueStatics;
    }

    private PaymentGetResponse paymentGetResponsesConverter(Payment payment) {
        PaymentGetResponse stationGetResponse = new PaymentGetResponse();
        stationGetResponse.setId(payment.getId());
        stationGetResponse.setMethod(payment.getMethod());
        stationGetResponse.setTotal(payment.getTotal());

        return stationGetResponse;
    }

    private PaymentResponse PaymentResponseConvertor(Payment payment) {
        PaymentResponse stationGetResponse = new PaymentResponse();
        stationGetResponse.setId(payment.getId());
        return stationGetResponse;
    }
}
