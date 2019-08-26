package com.github.dgmike.tweetclassify.api.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users_followers")
public class UsersAndFollowers {

	@Id
	private String id;

	private UserAndFollowersValue value;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public UserAndFollowersValue getValue() {
		return value;
	}

	public void setValue(UserAndFollowersValue value) {
		this.value = value;
	}
}
