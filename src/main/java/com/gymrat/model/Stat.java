package com.gymrat.model;

public enum Stat {
    STRENGTH,
    ENDURANCE,
    FLEXIBILITY;

    public static Stat fromString(String s) {
        try {
            return Stat.valueOf(s.toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Unknown stat: " + s);
        }
    }
}
