package com.sentura.backend.entity;

import lombok.Data;

@Data
public class Country {
    private String name;
    private String capital;
    private String region;
    private long population;
    private String flag;
}