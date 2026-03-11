package com.sentura.backend.controller;

import com.sentura.backend.entity.Country;
import com.sentura.backend.service.CountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/countries")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CountryController {
    private final CountryService service;

    @GetMapping
    public List<Country> getAll(@RequestParam(required = false) String search) {
        List<Country> list = service.getCountries();
        if (search != null) {
            return list.stream()
                    .filter(c -> c.getName().toLowerCase().contains(search.toLowerCase()))
                    .collect(Collectors.toList());
        }
        return list;
    }
}
