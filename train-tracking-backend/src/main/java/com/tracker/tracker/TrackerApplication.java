package com.tracker.tracker;

import com.tracker.tracker.models.entities.Role;
import com.tracker.tracker.models.entities.Users;
import com.tracker.tracker.repositories.RoleRepository;
import com.tracker.tracker.repositories.UserRepository;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@EnableJpaRepositories
@OpenAPIDefinition
@RequiredArgsConstructor
@SpringBootApplication
public class TrackerApplication implements CommandLineRunner {
	private final UserRepository usersRepository;
	private final RoleRepository roleRepository;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Value("${superadmin_username}")
	private String superAdminUsername;
	@Value("${superadmin_email}")
	private String superAdminEmail;
	@Value("${superadmin_password}")
	private String superAdminPassword;

	public static void main(String[] args) {
		SpringApplication.run(TrackerApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		if (!usersRepository.findByUsername(superAdminUsername).isPresent()) {
			Users loginUser = new Users();
			loginUser.setPassword(passwordEncoder.encode(superAdminPassword));
			loginUser.setUsername(superAdminUsername);
			loginUser.setEmail(superAdminEmail);
			loginUser.setName("Super Admin");
			Set<Role> roles = new HashSet<>();
			roles.add(roleRepository.findByName("Super Admin"));
			loginUser.setRoles(roles);
			usersRepository.save(loginUser);
		}
	}
}
