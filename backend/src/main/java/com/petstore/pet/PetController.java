package com.petstore.pet;

import com.petstore.pet.dto.CreatePetRequest;
import com.petstore.pet.dto.PetDetailDto;
import com.petstore.pet.dto.PetSummaryDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pets")
@Tag(name = "Pets", description = "Manage pet listings with full CRUD operations")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping
    @Operation(summary = "List pets", description = "Returns a paginated list of pets. Optionally filter by one or more categories.")
    public ResponseEntity<Page<PetSummaryDto>> getPets(
            @Parameter(description = "Filter by category. Allowed: DOG, CAT, BIRD, FISH. Repeatable.")
            @RequestParam(required = false) List<Category> category,
            @PageableDefault(size = 12) Pageable pageable) {

        if (pageable.getPageSize() > 50) {
            return ResponseEntity.badRequest().build();
        }
        Page<PetSummaryDto> result = petService.getAllPets(category, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get pet detail", description = "Returns full detail for a single pet by its UUID.")
    public ResponseEntity<PetDetailDto> getPetById(
            @Parameter(description = "Pet UUID") @PathVariable UUID id) {
        PetDetailDto detail = petService.getPetById(id);
        return ResponseEntity.ok(detail);
    }

    @PostMapping
    @Operation(summary = "Create a new pet", description = "Creates a new pet in the catalogue.")
    public ResponseEntity<PetDetailDto> createPet(
            @Valid @RequestBody CreatePetRequest request) {
        PetDetailDto created = petService.createPet(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing pet", description = "Updates all fields of an existing pet.")
    public ResponseEntity<PetDetailDto> updatePet(
            @Parameter(description = "Pet UUID") @PathVariable UUID id,
            @Valid @RequestBody CreatePetRequest request) {
        PetDetailDto updated = petService.updatePet(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a pet", description = "Removes a pet from the catalogue.")
    public ResponseEntity<Void> deletePet(
            @Parameter(description = "Pet UUID") @PathVariable UUID id) {
        petService.deletePet(id);
        return ResponseEntity.noContent().build();
    }
}
