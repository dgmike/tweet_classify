package br.com.dgmike.tweetclassify.api.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import br.com.dgmike.tweetclassify.api.entity.UserEntity;

public interface UserRepository extends MongoRepository<UserEntity, String> {}
