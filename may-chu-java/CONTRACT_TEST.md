# Contract Test (Node.js vs Spring Boot)

Muc tieu: dam bao backend Java tra ve JSON shape trung voi backend Node.js, khong doi frontend.

## 1) Chuan bi

- Chay backend Node.js o 1 port (vi du `5001`)
- Chay backend Spring Boot o 1 port (vi du `5000`)
- Dam bao du lieu test tuong duong (seed data giong nhau)

## 2) Cau hinh URL so sanh

Mac dinh:

- Node: `http://localhost:5001`
- Spring: `http://localhost:5000`

Neu can doi:

PowerShell:

```powershell
$env:CONTRACT_NODE_BASE_URL="http://localhost:5001"
$env:CONTRACT_JAVA_BASE_URL="http://localhost:5000"
```

## 3) Chay test

```bash
mvn -Dtest=ContractShapeTest test
```

## 4) Route duoc test

Danh sach route nam trong file:

- `src/test/resources/contract-routes.txt`

Moi dong co dinh dang:

```text
/api/san-pham|GET
```

## Ghi chu

- Test hien tai so sanh `status code` + `JSON shape` (keys + node type), khong so sanh gia tri cu the.
- Voi array, test so sanh shape phan tu dau tien neu ca 2 ben deu co du lieu.
- Co the mo rong de test them route co auth (Bearer token) hoac route POST/PUT voi fixture payload.
