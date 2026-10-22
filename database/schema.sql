
CREATE DATABASE IF NOT EXISTS rapidresq;
USE rapidresq;


CREATE TABLE IF NOT EXISTS ambulances (
    ambulance_id INT AUTO_INCREMENT PRIMARY KEY,
    driver_name VARCHAR(100) NOT NULL,
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    status ENUM(
        'available',
        'assigned',
        'en_route_to_patient',
        'transporting_patient',
        'out_of_service'
    ) NOT NULL DEFAULT 'available',
    capabilities JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS hospitals (
    hospital_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_name VARCHAR(150) NOT NULL,
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    address VARCHAR(255) NOT NULL,
    facilities JSON,
    contact_number VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS emergencies (
    emergency_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_latitude DECIMAL(10,7) NOT NULL,
    patient_longitude DECIMAL(10,7) NOT NULL,
    emergency_category VARCHAR(50) NOT NULL,
    required_facilities JSON,
    status ENUM(
        'pending',
        'assigned',
        'in_progress',
        'completed',
        'cancelled',
        'expired',
        'unserved'
    ) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NULL,
    cancelled_at DATETIME NULL,
    completed_at DATETIME NULL
);


CREATE TABLE IF NOT EXISTS dispatches (
    dispatch_id INT AUTO_INCREMENT PRIMARY KEY,
    emergency_id INT NOT NULL,
    ambulance_id INT NOT NULL,
    hospital_id INT NULL,
    status ENUM(
        'assigned',
        'en_route_to_patient',
        'patient_picked_up',
        'en_route_to_hospital',
        'completed',
        'cancelled',
        'failed'
    ) NOT NULL DEFAULT 'assigned',
    estimated_response_minutes DECIMAL(8,2),
    actual_response_minutes DECIMAL(8,2),
    estimated_hospital_minutes DECIMAL(8,2),
    actual_hospital_minutes DECIMAL(8,2),
    estimated_distance_km DECIMAL(8,2),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    patient_picked_up_at DATETIME NULL,
    hospital_arrived_at DATETIME NULL,
    completed_at DATETIME NULL,

    CONSTRAINT fk_dispatch_emergency
        FOREIGN KEY (emergency_id)
        REFERENCES emergencies(emergency_id),

    CONSTRAINT fk_dispatch_ambulance
        FOREIGN KEY (ambulance_id)
        REFERENCES ambulances(ambulance_id),

    CONSTRAINT fk_dispatch_hospital
        FOREIGN KEY (hospital_id)
        REFERENCES hospitals(hospital_id)
);
