package com.sentura.backend.service;

import com.sentura.backend.entity.Country;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CountryService {
    private List<Country> cache = new ArrayList<>();
    private long lastFetched = 0;

    public List<Country> getCountries() {
        if (System.currentTimeMillis() - lastFetched > 600000) { // 10 mins
            fetchFromApi();
        }
        return cache;
    }

    private void fetchFromApi() {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags";

        try {
            List<Map<String, Object>> response = restTemplate.getForObject(url, List.class);

            if (response != null) {
                this.cache = response.stream().map(map -> {
                    Country c = new Country();
                    Map<String, Object> nameObj = (Map<String, Object>) map.get("name");
                    c.setName((String) nameObj.get("common"));

                    List<String> capitals = (List<String>) map.get("capital");
                    c.setCapital(capitals != null && !capitals.isEmpty() ? capitals.get(0) : "N/A");

                    c.setRegion((String) map.get("region"));
                    c.setPopulation(((Number) map.get("population")).longValue());
                    Map<String, Object> flagsObj = (Map<String, Object>) map.get("flags");
                    c.setFlag((String) flagsObj.get("png"));

                    return c;
                }).collect(Collectors.toList());

                lastFetched = System.currentTimeMillis();
            }
        } catch (Exception e) {
            System.err.println("Error fetching countries: " + e.getMessage());
        }
    }
}

