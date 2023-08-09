package com.tracker.tracker.services.impl;

import com.tracker.tracker.auth.UserDetailServiceImpl;
import com.tracker.tracker.auth.UserDetailsImpl;
import com.tracker.tracker.models.entities.Station;
import com.tracker.tracker.models.entities.Station;
import com.tracker.tracker.models.entities.Users;
import com.tracker.tracker.models.json.IdWithName;
import com.tracker.tracker.models.request.CreateStation;
import com.tracker.tracker.models.request.CreateStation;
import com.tracker.tracker.models.request.DeleteRequest;
import com.tracker.tracker.models.response.StationResponse;
import com.tracker.tracker.models.response.StationGetResponse;
import com.tracker.tracker.models.response.StationResponse;
import com.tracker.tracker.repositories.StationRepository;
import com.tracker.tracker.repositories.UserRepository;
import com.tracker.tracker.services.IStationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.OffsetDateTime;
import java.util.*;

@RequiredArgsConstructor
@Service
public class StationService implements IStationService {
    private final UserRepository usersRepository;
    private final StationRepository stationRepository;
    private final UserDetailServiceImpl userDetailsService;
    @Override
    public StationResponse createStation(CreateStation createStation, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();
        
        Station newStation =new Station();
        newStation.setName(createStation.getName());
        newStation.setAddress(createStation.getAddress());
        newStation.setLng(createStation.getLng());
        newStation.setLat(createStation.getLat());
        newStation.setContact(createStation.getContact());
        newStation.setCreatedBy(user);
        newStation.setCreatedTime(OffsetDateTime.now());
        newStation.setModifiedTime(OffsetDateTime.now());
        return StationResponseConvertor(stationRepository.save(newStation));
    }

    @Override
    public StationResponse updateStation(UUID id, CreateStation createStation, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();
        Station updateStation = stationRepository.findById(id).get();
        updateStation.setName(createStation.getName());
        updateStation.setAddress(createStation.getAddress());
        updateStation.setLng(createStation.getLng());
        updateStation.setLat(createStation.getLat());
        updateStation.setContact(createStation.getContact());
        updateStation.setModifiedBy(user);
        updateStation.setModifiedTime(OffsetDateTime.now());
        return StationResponseConvertor(stationRepository.save(updateStation));
    }

    @Override
    public List<StationGetResponse> getStation(UUID trainId) {
        List<StationGetResponse> stationGetResponses = new ArrayList<>();
        {
            if (stationRepository.findAll().size()>0) {
                stationGetResponses.add(stationGetResponsesConverter(stationRepository.findById(trainId).get()));
            }
        }
        return stationGetResponses;
    }

    @Override
    public List<StationGetResponse> getAllStation() {
        List<StationGetResponse> stationGetResponses = new ArrayList<>();

        for (Station train :
                stationRepository.findByDeletedOrderByCreatedTimeDesc(false)) {
            stationGetResponses.add(stationGetResponsesConverter(train));
        }
        return stationGetResponses;
    }

    @Override
    public StationResponse deleteStation(DeleteRequest deleteRequest, Principal principal) {
        UserDetailsImpl userImpl = (UserDetailsImpl) userDetailsService.loadUserByUsername(principal.getName());
        Users user = usersRepository.findById(userImpl.getId()).get();
        Station DeleStation =
                stationRepository.findById(UUID.fromString(deleteRequest.getId())).get();
        DeleStation .setDeleted(deleteRequest.getDelete());
        DeleStation .setModifiedBy(user);
        DeleStation .setModifiedTime(OffsetDateTime.now());

        return StationResponseConvertor(stationRepository.save(DeleStation));
    }

    private StationGetResponse stationGetResponsesConverter(Station train) {
        StationGetResponse stationGetResponse = new StationGetResponse();
        stationGetResponse.setId(train.getId());
        stationGetResponse.setName(train.getName());
        stationGetResponse.setAddress(train.getAddress());
        stationGetResponse.setLng(train.getLng());
        stationGetResponse.setLat(train.getLat());
        stationGetResponse.setContact(train.getContact());

        return stationGetResponse;
    }

    private StationResponse StationResponseConvertor(Station train) {
        StationResponse stationGetResponse = new StationResponse();
        stationGetResponse.setId(train.getId());
        stationGetResponse.setName(train.getName());
        return stationGetResponse;
    }
}
