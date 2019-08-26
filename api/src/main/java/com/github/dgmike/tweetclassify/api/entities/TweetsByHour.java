package com.github.dgmike.tweetclassify.api.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tweets_by_hours")
public class TweetsByHour {
	@Id
	private String id;
	TweetByHourValue value;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public TweetByHourValue getValue() {
		return value;
	}

	public void setValue(TweetByHourValue value) {
		this.value = value;
	}
}
