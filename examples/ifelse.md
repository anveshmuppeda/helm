apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  {{ if .Values.configMap.data.darkMode }}          # boolean check
  mode: dark
  {{ else }}
  mode: light
  {{ end }}
  {{ if eq .Values.configMap.data.env "prod"  }}    # string check
  env: prod
  {{ else if eq .Values.configMap.data.env "dev" }}
  env: dev
  {{ else }}
  env: test
  {{ end }}
