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
        String url = "https://restcountries.com/v3.1/all";
        List<Map<String, Object>> response = restTemplate.getForObject(url, List.class);

        this.cache = response.stream().map(map -> {
            Country c = new Country();
            c.setName((String) ((Map) map.get("name")).get("common"));
            c.setCapital(map.get("capitals") != null ? ((List<String>) map.get("capitals")).get(0) : "N/A");
            c.setRegion((String) map.get("region"));
            c.setPopulation(((Number) map.get("population")).longValue());
            c.setFlag((String) ((Map) map.get("flags")).get("png"));
            return c;
        }).collect(Collectors.toList());
        lastFetched = System.currentTimeMillis();
    }
}

