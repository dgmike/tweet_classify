package com.github.dgmike.tweetclassify.api.repositories;

import com.github.dgmike.tweetclassify.api.entities.HashtagsByCountries;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Collection;

@RepositoryRestResource(collectionResourceRel = "hashtags_by_countries", path = "hashtags_by_countries")
public interface HashtagsByCountriesRepository extends MongoRepository<HashtagsByCountries, String> {
	Page<HashtagsByCountries> findByIdIn(Collection ids, Pageable pageable);
}
