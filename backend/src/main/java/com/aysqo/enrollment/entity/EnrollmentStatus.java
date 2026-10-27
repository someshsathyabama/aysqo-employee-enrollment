package com.aysqo.enrollment.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EnrollmentStatus {
    DRAFT("Draft"),
    SUBMITTED("Submitted"),
    APPROVED("Approved");

    private final String displayName;

    EnrollmentStatus(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static EnrollmentStatus fromString(String value) {
        if (value == null) return null;
        for (EnrollmentStatus status : EnrollmentStatus.values()) {
            if (status.displayName.equalsIgnoreCase(value) || status.name().equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown enrollment status: " + value);
    }

    @Override
    public String toString() {
        return displayName;
    }
}
