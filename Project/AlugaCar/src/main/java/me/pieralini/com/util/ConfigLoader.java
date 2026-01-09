package me.pieralini.com.util;

import java.io.File;
import java.io.FileInputStream;
import java.util.HashMap;
import java.util.Map;
import org.yaml.snakeyaml.Yaml;

public class ConfigLoader {
    public static Map<String, String> loadConfig() {
        Map<String, String> out = new HashMap<>();
        File cfgFile = new File("config.yml");
        if (!cfgFile.exists()) {
            return out;
        }
        try (FileInputStream fis = new FileInputStream(cfgFile)) {
            Yaml yaml = new Yaml();
            Map<String, Object> data = yaml.load(fis);
            if (data == null) return out;
            if (data.containsKey("database")) {
                Object db = data.get("database");
                if (db instanceof Map) {
                    Map<?,?> dbMap = (Map<?,?>) db;
                    dbMap.forEach((k, v) -> out.put(String.valueOf(k), String.valueOf(v)));
                }
            }
            if (data.containsKey("timezone")) {
                out.put("timezone", String.valueOf(data.get("timezone")));
            }
        } catch (Exception ignored) {}
        return out;
    }
}