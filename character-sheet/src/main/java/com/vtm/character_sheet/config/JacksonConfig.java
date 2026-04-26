package com.vtm.character_sheet.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdScalarDeserializer;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.safety.Safelist;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class JacksonConfig {

    @Bean
    public SimpleModule htmlSanitizationModule() {
        SimpleModule module = new SimpleModule("HtmlSanitization");
        module.addDeserializer(String.class, new StdScalarDeserializer<>(String.class) {
            @Override
            public String deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
                String value = p.getValueAsString();
                if (value == null) return null;
                // Strip all HTML tags but do NOT entity-encode the result.
                // Jsoup.clean() encodes &, <, >, " as HTML entities, which causes
                // double-encoding on each save cycle (& → &amp; → &amp;amp; …).
                // Fix: clean first, then unescape entities back to plain text.
                String cleaned = Jsoup.clean(value, "", Safelist.none(),
                        new Document.OutputSettings().prettyPrint(false));
                return org.jsoup.parser.Parser.unescapeEntities(cleaned, false);
            }
        });
        return module;
    }
}
