package com.github.dgmike.tweetclassify.api.repositories;

import com.github.dgmike.tweetclassify.api.entities.Term;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "terms", path = "terms")
public interface TermRepository extends MongoRepository<Term, String> {
}
