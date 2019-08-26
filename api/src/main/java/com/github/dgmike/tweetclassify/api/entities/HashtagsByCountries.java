package com.github.dgmike.tweetclassify.api.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(value = "hashtags_by_countries")
public class HashtagsByCountries {
	@Id
	private String id;

	private Map<String, Integer> value;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Map<String, Integer> getValue() {
		return value;
	}

	public void setValue(Map<String, Integer> value) {
		this.value = value;
	}

}
