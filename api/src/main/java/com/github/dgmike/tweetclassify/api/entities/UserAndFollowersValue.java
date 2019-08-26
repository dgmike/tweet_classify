package com.github.dgmike.tweetclassify.api.entities;

public class UserAndFollowersValue {

	private Integer id;
	private Integer followers_count;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getFollowers_count() {
		return followers_count;
	}

	public void setFollowers_count(Integer followers_count) {
		this.followers_count = followers_count;
	}
}
