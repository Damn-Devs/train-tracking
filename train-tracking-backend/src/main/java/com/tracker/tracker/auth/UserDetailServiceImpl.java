package com.tracker.tracker.auth;

import com.tracker.tracker.models.entities.Users;
import com.tracker.tracker.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {
    private final UserRepository usersRepository;
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user;
            user = (Users) usersRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("Can't login with super admin"));

        return UserDetailsImpl.build(user);
    }
}
