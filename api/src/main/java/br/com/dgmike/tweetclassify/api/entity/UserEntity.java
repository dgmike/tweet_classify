package br.com.dgmike.tweetclassify.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "users")
@Data
@NoArgsConstructor
public class UserEntity {
    @Id
    private String id;

    private String name;

    @JsonIgnore
    private String password;
}
