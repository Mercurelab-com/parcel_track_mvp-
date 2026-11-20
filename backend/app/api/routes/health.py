from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health", summary="Health Check")
def health_check():
    """Verify that the API server is running and responsive.

    Does not depend on database or external services.
    """
    return {"status": "ok"}
