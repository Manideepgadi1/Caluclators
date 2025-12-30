"""
Life Goal Calculators API Router
"""
from fastapi import APIRouter, HTTPException
from app.models.life_goal import (
    RetirementInput, RetirementOutput,
    EducationInput, EducationOutput,
    MarriageInput, MarriageOutput,
    OtherGoalInput, OtherGoalOutput
)
from app.services.life_goal_service import (
    RetirementCalculator,
    EducationCalculator,
    MarriageCalculator,
    OtherGoalCalculator
)

router = APIRouter()


@router.post("/retirement", response_model=RetirementOutput)
async def calculate_retirement(data: RetirementInput):
    """
    Plan Your Retirement Calculator
    
    Calculates retirement corpus needed and investment requirements
    based on current age, expenses, and expected returns.
    """
    try:
        return RetirementCalculator.calculate(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Calculation error")


@router.post("/education", response_model=EducationOutput)
async def calculate_education(data: EducationInput):
    """
    Child Education Calculator
    
    Calculates target amount for child's education and
    required monthly/yearly SIP to achieve the goal.
    """
    try:
        return EducationCalculator.calculate(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Calculation error")


@router.post("/marriage", response_model=MarriageOutput)
async def calculate_marriage(data: MarriageInput):
    """
    Marriage for Child Calculator
    
    Calculates target amount for child's marriage and
    required investments to achieve the goal.
    """
    try:
        return MarriageCalculator.calculate(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Calculation error")


@router.post("/other-goal", response_model=OtherGoalOutput)
async def calculate_other_goal(data: OtherGoalInput):
    """
    Your Other Goal Calculator
    
    Custom goal calculator for any financial target.
    Calculates required investments based on goal cost and timeline.
    """
    try:
        return OtherGoalCalculator.calculate(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Calculation error")
