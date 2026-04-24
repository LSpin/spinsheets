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
                // Strip all HTML tags, preserve text. prettyPrint(false) keeps
                // original whitespace/newlines. The default OutputSettings escape
                // mode re-encodes <, >, &, " so stored data stays safe.
                return Jsoup.clean(value, "", Safelist.none(),
                        new Document.OutputSettings().prettyPrint(false));
            }
        });
        return module;
    }
}
