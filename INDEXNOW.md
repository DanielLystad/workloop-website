# IndexNow Implementasjon

## Hva er IndexNow?

IndexNow er en protokoll som lar deg umiddelbart varsle søkemotorer når innholdet ditt endres. I stedet for å vente i dager eller uker på at søkemotorer skal crawle siden din, kan du nå få sider indeksert på timer eller til og med minutter.

## Hvilke søkemotorer støtter IndexNow?

- **Microsoft Bing**
- **Yandex**
- **DuckDuckGo** (via Bing)
- Andre som tar i bruk protokollen

## Vår implementasjon

### API-nøkkel
```
e2cbfd4236580bfa85fddef51df85401c1a5c61e252e0e60cc3eda4f0465e119
```

### Nøkkelfil
API-nøkkelen er lagret i:
```
https://workloop.no/e2cbfd4236580bfa85fddef51df85401c1a5c61e252e0e60cc3eda4f0465e119.txt
```

### Meta-tag
Alle HTML-sider har følgende meta-tag:
```html
<meta name="indexnow-key" content="e2cbfd4236580bfa85fddef51df85401c1a5c61e252e0e60cc3eda4f0465e119">
```

## Hvordan submitte URL-er

### Automatisk (anbefalt)
Kjør submission-scriptet:
```bash
./submit-indexnow.sh
```

### Manuelt med curl
```bash
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d '{
    "host": "workloop.no",
    "key": "e2cbfd4236580bfa85fddef51df85401c1a5c61e252e0e60cc3eda4f0465e119",
    "keyLocation": "https://workloop.no/e2cbfd4236580bfa85fddef51df85401c1a5c61e252e0e60cc3eda4f0465e119.txt",
    "urlList": [
      "https://workloop.no/",
      "https://workloop.no/about",
      "https://workloop.no/services",
      "https://workloop.no/prosjekter",
      "https://workloop.no/contact"
    ]
  }'
```

### Ved oppdateringer
Hver gang du oppdaterer innhold på siden, kjør submission-scriptet for å varsle søkemotorene umiddelbart.

## Fordeler

✅ **Raskere indeksering** - Timer i stedet for dager/uker
✅ **Mindre belastning** - Søkemotorer crawler bare det som faktisk har endret seg
✅ **Bedre SEO** - Nytt innhold blir synlig raskere
✅ **Gratis** - Ingen kostnader for å bruke IndexNow

## Verifisering

Du kan verifisere at implementasjonen fungerer via:
1. **Bing Webmaster Tools**: https://www.bing.com/webmasters
2. Sjekk at nøkkelfilen er tilgjengelig: https://workloop.no/e2cbfd4236580bfa85fddef51df85401c1a5c61e252e0e60cc3eda4f0465e119.txt

## Ressurser

- [IndexNow Documentation](https://www.indexnow.org/documentation)
- [Bing IndexNow Guide](https://www.bing.com/indexnow/getstarted)
- [Best Practices](https://www.trysight.ai/blog/indexnow-implementation-guide)
