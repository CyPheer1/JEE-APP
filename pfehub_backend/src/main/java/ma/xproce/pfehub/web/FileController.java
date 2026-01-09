package ma.xproce.pfehub.web;

import lombok.RequiredArgsConstructor;
import ma.xproce.pfehub.service.IFileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"}, allowCredentials = "true")
public class FileController {

    private final IFileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "subDirectory", defaultValue = "general") String subDirectory) {
        try {
            String filePath = fileStorageService.storeFile(file, subDirectory);
            return ResponseEntity.ok(Map.of(
                    "message", "File uploaded successfully",
                    "filePath", filePath,
                    "originalName", file.getOriginalFilename(),
                    "size", file.getSize()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/download/{subDirectory}/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable String subDirectory,
            @PathVariable String fileName,
            HttpServletRequest request) {
        try {
            Resource resource = fileStorageService.loadFileAsResource(fileName, subDirectory);

            // Try to determine file's content type
            String contentType = null;
            try {
                contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            } catch (IOException ex) {
                // Could not determine file type
            }

            // Fallback to the default content type if type could not be determined
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/view/{subDirectory}/{fileName:.+}")
    public ResponseEntity<Resource> viewFile(
            @PathVariable String subDirectory,
            @PathVariable String fileName,
            HttpServletRequest request) {
        try {
            Resource resource = fileStorageService.loadFileAsResource(fileName, subDirectory);

            String contentType = null;
            try {
                contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            } catch (IOException ex) {
                // Could not determine file type
            }

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{subDirectory}/{fileName:.+}")
    public ResponseEntity<?> deleteFile(
            @PathVariable String subDirectory,
            @PathVariable String fileName) {
        try {
            fileStorageService.deleteFile(fileName, subDirectory);
            return ResponseEntity.ok(Map.of("message", "File deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/exists/{subDirectory}/{fileName:.+}")
    public ResponseEntity<?> checkFileExists(
            @PathVariable String subDirectory,
            @PathVariable String fileName) {
        boolean exists = fileStorageService.fileExists(fileName, subDirectory);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
}
