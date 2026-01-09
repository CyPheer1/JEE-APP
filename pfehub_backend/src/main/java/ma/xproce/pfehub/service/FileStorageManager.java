package ma.xproce.pfehub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageManager implements IFileStorageService {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    private Path rootLocation;

    @PostConstruct
    public void init() {
        rootLocation = Paths.get(uploadDir);
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }

    @Override
    public String storeFile(MultipartFile file, String subDirectory) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file");
            }

            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String extension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0) {
                extension = originalFilename.substring(dotIndex);
            }

            // Generate unique filename
            String newFilename = UUID.randomUUID().toString() + extension;

            // Create subdirectory if it doesn't exist
            Path subDir = rootLocation.resolve(subDirectory);
            Files.createDirectories(subDir);

            // Copy file
            Path destinationFile = subDir.resolve(newFilename).normalize().toAbsolutePath();
            
            if (!destinationFile.getParent().equals(subDir.toAbsolutePath())) {
                throw new RuntimeException("Cannot store file outside current directory");
            }

            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

            return subDirectory + "/" + newFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    @Override
    public Resource loadFileAsResource(String fileName, String subDirectory) {
        try {
            Path filePath = rootLocation.resolve(subDirectory).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read file: " + fileName);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Could not read file: " + fileName, e);
        }
    }

    @Override
    public void deleteFile(String fileName, String subDirectory) {
        try {
            Path filePath = rootLocation.resolve(subDirectory).resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Could not delete file: " + fileName, e);
        }
    }

    @Override
    public Path getFilePath(String fileName, String subDirectory) {
        return rootLocation.resolve(subDirectory).resolve(fileName).normalize();
    }

    @Override
    public boolean fileExists(String fileName, String subDirectory) {
        Path filePath = rootLocation.resolve(subDirectory).resolve(fileName).normalize();
        return Files.exists(filePath);
    }
}
