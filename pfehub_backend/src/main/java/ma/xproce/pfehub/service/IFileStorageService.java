package ma.xproce.pfehub.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;

public interface IFileStorageService {
    
    String storeFile(MultipartFile file, String subDirectory);
    
    Resource loadFileAsResource(String fileName, String subDirectory);
    
    void deleteFile(String fileName, String subDirectory);
    
    Path getFilePath(String fileName, String subDirectory);
    
    boolean fileExists(String fileName, String subDirectory);
}
