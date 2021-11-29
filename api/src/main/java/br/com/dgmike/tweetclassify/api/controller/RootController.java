package br.com.dgmike.tweetclassify.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.dgmike.tweetclassify.api.entity.UserEntity;
import br.com.dgmike.tweetclassify.api.repository.UserRepository;

@RestController
public class RootController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping(value = "/")
    public UserEntity root() {
        UserEntity user = new UserEntity();
        user.setName("Fernando");
        user.setPassword(passwordEncoder.encode("1234"));
        return user;
    }

    @GetMapping(value = "/all")
    public List<UserEntity> listAllUsers() {
        return userRepository.findAll();
    }

}
