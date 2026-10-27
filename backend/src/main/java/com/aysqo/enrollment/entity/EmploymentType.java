package com.aysqo.enrollment.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EmploymentType {
    FULL_TIME("Full-Time"),
    PART_TIME("Part-Time"),
    CONTRACT("Contract"),
    INTERN("Intern");

    private final String displayName;

    EmploymentType(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static EmploymentType fromString(String value) {
        if (value == null) return null;
        for (EmploymentType type : EmploymentType.values()) {
            if (type.displayName.equalsIgnoreCase(value) || type.name().equalsIgnoreCase(value.replace("-", "_"))) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown employment type: " + value);
    }

    @Override
    public String toString() {
        return displayName;
    }
}
