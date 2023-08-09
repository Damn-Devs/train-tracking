package com.tracker.tracker.services.impl;

import com.tracker.tracker.auth.UserDetailServiceImpl;
import com.tracker.tracker.auth.UserDetailsImpl;
import com.tracker.tracker.models.entities.*;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.response.PassengerGetResponse;
import com.tracker.tracker.repositories.BookingRepository;
import com.tracker.tracker.repositories.PassengerRepository;
import com.tracker.tracker.models.request.PassengerCreate;
import com.tracker.tracker.models.response.PassengerResponse;
import com.tracker.tracker.repositories.PromoRepository;
import com.tracker.tracker.repositories.RoleRepository;
import com.tracker.tracker.repositories.UserRepository;
import com.tracker.tracker.services.IPassengerService;
import java.security.Principal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PassengerService implements IPassengerService {
  private final UserDetailServiceImpl userDetailsService;
  private final UserRepository usersRepository;
  private final RoleRepository roleRepository;
  private final UserService userService;
  private final PassengerRepository passengerRepository;
  private final BookingRepository bookingRepository;
  private final PromoRepository promoRepository;

  @Autowired
  PasswordEncoder passwordEncoder;

  @Override
  public PassengerResponse passengerCreate(PassengerCreate passengerRequest) {
    Role role = roleRepository.findByName("Passenger");
    Set<Role> roles = new HashSet<>();
    roles.add(role);

    Users newUser = new Users();
    newUser.setName(passengerRequest.getName());
    newUser.setUsername(passengerRequest.getUsername());
    newUser.setPassword(passwordEncoder.encode(passengerRequest.getPassword()));
    newUser.setEmail(passengerRequest.getEmail());
    newUser.setRoles(roles);
    newUser.setCreatedTime(OffsetDateTime.now());
    newUser.setModifiedTime(OffsetDateTime.now());
    Users user = usersRepository.save(newUser);

    Passenger newPassenger =new Passenger();
    newPassenger.setCreatedTime(OffsetDateTime.now());
    newPassenger.setContact(passengerRequest.getContact());
    newPassenger.setNic(passengerRequest.getNic());
    newPassenger.setCreatedBy(user);
    newPassenger.setUser(user);
    return PassengerResponseConvertor(passengerRepository.save(newPassenger));
  }

  @Override
  public PassengerResponse passengerUpdate(UUID id, PassengerCreate passengerRequest,
      Principal principal) {
    Passenger passenger = passengerRepository.getById(id);
    Role role = roleRepository.findByName("Passenger");
    Set<Role> roles = new HashSet<>();
    roles.add(role);

    Users userCreateRequest = passenger.getUser();
    userCreateRequest.setName(passengerRequest.getName());
    userCreateRequest.setUsername(passengerRequest.getUsername());
    userCreateRequest.setPassword(passwordEncoder.encode(passengerRequest.getPassword()));
    userCreateRequest.setEmail(passengerRequest.getEmail());
    userCreateRequest.setRoles(roles);
    Users newUser = usersRepository.save(userCreateRequest);

    passenger.setCreatedTime(OffsetDateTime.now());
    passenger.setContact(passengerRequest.getContact());
    passenger.setNic(passengerRequest.getNic());
    passenger.setCreatedBy(newUser);
    passenger.setUser(newUser);
    return PassengerResponseConvertor(passengerRepository.save(passenger));
  }

  @Override
  public PassengerGetResponse getPassenger(UUID userId) {
    Passenger passenger = passengerRepository.findByUser_Id(userId);
    PassengerGetResponse passengerGetResponse = new PassengerGetResponse();
    passengerGetResponse.setId(passenger.getId());
    passengerGetResponse.setName(passenger.getUser().getName());
    passengerGetResponse.setUsername(passenger.getUser().getUsername());
    passengerGetResponse.setEmail(passenger.getUser().getEmail());
    passengerGetResponse.setContact(passenger.getContact());
    passengerGetResponse.setContact(passenger.getContact());
    passengerGetResponse.setNic(passenger.getNic());
    return passengerGetResponse;
  }

  @Override
  public List<PassengerGetResponse> getAllPassenger() {
    List<PassengerGetResponse> passengerGetResponses = new ArrayList<>();
    List<Passenger> passengers = passengerRepository.findByDeleted(false);

    for (Passenger passenger:passengers) {
      PassengerGetResponse passengerGetResponse = new PassengerGetResponse();
      passengerGetResponse.setId(passenger.getId());
      passengerGetResponse.setName(passenger.getUser().getName());
      passengerGetResponse.setUsername(passenger.getUser().getUsername());
      passengerGetResponse.setEmail(passenger.getUser().getEmail());
      passengerGetResponse.setContact(passenger.getContact());
      passengerGetResponse.setNic(passenger.getNic());
      passengerGetResponses.add(passengerGetResponse);
    }

    return passengerGetResponses;
  }

  @Override
  public List<Booking> onGoingActivities(Principal principal) {
    UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
    Users user = usersRepository.findById(userImpl.getId()).get();
    List<Booking> bookings =
        bookingRepository.findByCreatedBy_IdAndSchedule_ArrivalTimeGreaterThan(user.getId(),
            OffsetDateTime.now());
    return bookings;
  }

  @Override
  public List<Booking> completedActivities(Principal principal) {
    UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
    Users user = usersRepository.findById(userImpl.getId()).get();
    List<Booking> bookings =
        bookingRepository.findByCreatedBy_IdAndSchedule_ArrivalTimeLessThan(user.getId(),
            OffsetDateTime.now());
    return bookings;
  }

  // REMOVE-THIS
  @Override
  public PassengerResponse passengerDelete(DeleteRequest deleteRequest, Principal principal) {
    UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
    Users user = usersRepository.findById(userImpl.getId()).get();

    Passenger deletePassenger =
            passengerRepository.findById(UUID.fromString(deleteRequest.getId())).get();
    deletePassenger.setDeleted(deleteRequest.getDelete());
    deletePassenger.setModifiedBy(user);
    deletePassenger.setModifiedTime(OffsetDateTime.now());

    return PassengerResponseConvertor(passengerRepository.save(deletePassenger));
  }

  @Override
  public double checkPromo(String promo, double price, UUID userId) {
    if(price == 0){
      return 0;
    }

    if(passengerRepository.existsByPromotions_CodeAndId(promo, userId)){
      return price;
    }

    Passenger passenger = passengerRepository.getById(userId);
    Promotion promotion = promoRepository.findByCode(promo);
    if(promotion != null){
      double discount = (promotion.getDiscount() / 100) * price;
      passenger.getPromotions().add(promotion);
      passengerRepository.save(passenger);
      return price - discount;
    }

    return price;
  }

  @Override
  public Passenger getPassengerByUserId(UUID id) {
    Passenger passenger = passengerRepository.findByUser_Id(id);
    return passenger;
  }
  // --------------------------------------------------------------------------------------

  private PassengerResponse PassengerResponseConvertor(Passenger passenger) {
    PassengerResponse response = new PassengerResponse();
    response.setId(passenger.getId());
    return response;
  }
}
